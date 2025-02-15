export const mainToCenter = () => {
    try {
        const main = document.getElementsByTagName("main")[0];
        main.style.top = String(document.getElementsByTagName("header")[0].clientHeight) + "px";
        main.style.height = String(window.innerHeight - document.getElementsByTagName("header")[0].clientHeight) + "px";
        main.style.justifyContent = "center";

        return main;
    }
    catch {}
}

export const mainToStart = () => {
    try {
        const main = document.getElementsByTagName("main")[0];
        main.style.height = String(window.outerHeight - document.getElementsByTagName("header")[0].clientHeight) + "px";
        main.style.justifyContent = "flex-start";

        return main;
    }
    catch {}
}