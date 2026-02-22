import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class InsecureApp {

    // Hardcoded DB config (bad)
    private static final String DB_URL = "jdbc:mysql://mydatabase.com:3306/testdb";
    private static final String DB_USER = "admin";
    private static final String DB_PASS = "secret123";

    public static String getUserInput(String[] args) {
        return (args.length > 0) ? args[0] : "echo hello";
    }

    public static void runCommand(String userCmd) throws Exception {
        // Command injection risk (bad)
        Process p = Runtime.getRuntime().exec(userCmd);
        BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }
    }

    public static String getData() throws Exception {
        // Insecure HTTP (no TLS)
        URL url = new URL("http://insecure-api.com/get-data");
        BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));
        StringBuilder sb = new StringBuilder();
        String inputLine;
        while ((inputLine = in.readLine()) != null) {
            sb.append(inputLine);
        }
        in.close();
        return sb.toString();
    }

    public static void saveToDb(String data) throws Exception {
        // SQL injection risk via string concatenation (bad)
        String query = "INSERT INTO mytable (column1, column2) VALUES ('" + data + "', 'Another Value')";
        Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
        Statement stmt = conn.createStatement();
        stmt.execute(query);
        stmt.close();
        conn.close();
    }

    public static void main(String[] args) throws Exception {
        String userCmd = getUserInput(args);
        String data = getData();
        saveToDb(data);
        runCommand(userCmd);
    }
}