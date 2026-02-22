import { exec } from "child_process";
import * as http from "http";

const config = {
    host: "mydatabase.com",
    user: "admin",
    password: "secret123", // Hardcoded secret (bad)
};

function getUserInput(): string {
    // untrusted input from CLI
    return process.argv[2] || "echo hello";
}

function runCommand(cmd: string) {
  // Command injection risk (bad)
  exec(cmd, (err, stdout, stderr) => {
    if (err) console.error("Exec error:", err);
    console.log(stdout);
    console.error(stderr);
  });
}

function getData(callback: (data: string) => void) {
  // Insecure HTTP (no TLS)
  const url = "http://insecure-api.com/get-data";
  http.get(url, (res) => {
    let raw = "";
    res.on("data", (chunk) => (raw += chunk));
    res.on("end", () => callback(raw));
  });
}

function saveToDb(data: string) {
  // Example of unsafe query construction (SQL injection style)
  const query = `INSERT INTO mytable (column1, column2) VALUES ('${data}', 'Another Value')`;
  console.log("Running query:", query);
  // (Not actually connecting—kept simple for demo)
}

const userInput = getUserInput();
getData((data) => {
  saveToDb(data);
  runCommand(userInput);
});