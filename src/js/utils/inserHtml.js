import fs from 'fs';

export default insertHtml = (domId, filepath) => {
    const root = document.body;
    const dom = root.querySelector(domId);
    if(dom) {
        return dom;
    } 
    const snipplet = fs.readFileSync(filepath);
    const wrapper = document.createElement("div");

    wrapper.id = domId;
    wrapper.style.display = 'none';
    wrapper.innerHTML = snipplet;
    root.append(wrapper);

    return wrapper;
}