export default function insertCSS(filepath) {
  let cssTextContent = fs
    .readFileSync(filepath)
    .toString();
  let cssHolder = document.createElement("style");
  cssHolder.type = "text/css";
  cssHolder.innerHTML = cssTextContent;
  document.head.append(cssHolder);
}
