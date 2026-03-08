import { pathToFileURL } from "node:url";
import path from "node:path";
import { chromium } from "playwright";

const [, , htmlArg = "build/resume.html", pdfArg = "resume.pdf"] = process.argv;

const htmlPath = path.resolve(process.cwd(), htmlArg);
const pdfPath = path.resolve(process.cwd(), pdfArg);
const htmlUrl = pathToFileURL(htmlPath).href;

const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage();
  await page.goto(htmlUrl, { waitUntil: "networkidle" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "12mm",
      right: "12mm",
      bottom: "12mm",
      left: "12mm"
    }
  });
} finally {
  await browser.close();
}
