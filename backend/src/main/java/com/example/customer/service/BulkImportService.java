package com.example.customer.service;

import com.example.customer.dto.BulkResultDTO;
import com.example.customer.entity.Customer;
import com.example.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.util.XMLHelper;
import org.apache.poi.xssf.eventusermodel.ReadOnlySharedStringsTable;
import org.apache.poi.xssf.eventusermodel.XSSFReader;
import org.apache.poi.xssf.eventusermodel.XSSFSheetXMLHandler;
import org.apache.poi.xssf.model.SharedStringsTable;
import org.apache.poi.xssf.model.StylesTable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.ContentHandler;
import org.xml.sax.InputSource;
import org.xml.sax.XMLReader;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BulkImportService {

    private final CustomerRepository customerRepo;
    private static final int BATCH_SIZE = 500;

    @Transactional
    public BulkResultDTO processFile(MultipartFile file) throws Exception {
        List<Customer> batch = new ArrayList<>(BATCH_SIZE);
        int[] stats = {0, 0}; // [success, failed]

        try (InputStream is = file.getInputStream();
             OPCPackage pkg = OPCPackage.open(is)) {

            XSSFReader reader = new XSSFReader(pkg);
            ReadOnlySharedStringsTable sst = new ReadOnlySharedStringsTable(pkg);
            StylesTable styles = reader.getStylesTable();
            
            XMLReader parser = XMLHelper.newXMLReader();
            
            SheetRowHandler handler = new SheetRowHandler(batch, customerRepo, stats);
            ContentHandler contentHandler = new XSSFSheetXMLHandler(styles, sst, handler, false);
            parser.setContentHandler(contentHandler);

            Iterator<InputStream> sheets = reader.getSheetsData();
            if (sheets.hasNext()) {
                try (InputStream sheetIs = sheets.next()) {
                    parser.parse(new InputSource(sheetIs));
                }
            }
        }

        if (!batch.isEmpty()) {
            customerRepo.saveAll(batch);
        }

        return new BulkResultDTO(stats[0], stats[1]);
    }

    private static class SheetRowHandler implements XSSFSheetXMLHandler.SheetContentsHandler {
        private final List<Customer> batch;
        private final CustomerRepository repo;
        private final int[] stats;
        private List<String> currentRow = new ArrayList<>();
        private boolean isHeader = true;

        public SheetRowHandler(List<Customer> batch, CustomerRepository repo, int[] stats) {
            this.batch = batch;
            this.repo = repo;
            this.stats = stats;
        }

        @Override
        public void startRow(int rowNum) {
            currentRow.clear();
        }

        @Override
        public void endRow(int rowNum) {
            if (isHeader) {
                isHeader = false;
                return;
            }
            if (currentRow.size() >= 3) {
                try {
                    String name = currentRow.get(0);
                    String dobStr = currentRow.get(1);
                    String nic = currentRow.get(2);

                    if (name != null && !name.isEmpty() && nic != null && !nic.isEmpty()) {
                        if (!repo.existsByNicNumber(nic)) {
                            Customer c = new Customer();
                            c.setName(name);
                            c.setDob(LocalDate.parse(dobStr));
                            c.setNicNumber(nic);
                            batch.add(c);
                            stats[0]++;
                            
                            if (batch.size() >= BATCH_SIZE) {
                                repo.saveAll(batch);
                                batch.clear();
                            }
                        } else {
                            stats[1]++;
                        }
                    } else {
                        stats[1]++;
                    }
                } catch (DateTimeParseException | IndexOutOfBoundsException e) {
                    stats[1]++;
                }
            } else {
                stats[1]++;
            }
        }

        @Override
        public void cell(String cellReference, String formattedValue, org.apache.poi.xssf.usermodel.XSSFComment comment) {
            currentRow.add(formattedValue);
        }

        @Override
        public void headerFooter(String text, boolean isHeader, String tagName) {}
    }
}
