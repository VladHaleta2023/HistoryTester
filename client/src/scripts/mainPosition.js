export const mainToCenter = (auth=false) => {
    try {
        const main = document.querySelector("main");
        const headerHeight = document.querySelector("header").offsetHeight;

        if (auth) {
            main.style.position = "absolute";
            main.style.top = "50%";
            main.style.left = "50%";
            main.style.transform = "translate(-50%, -50%)";
            main.style.textAlign = "center";
        }
        else {
            main.style.position = "relative";
            main.style.top = `${headerHeight}px`;
            main.style.height = `calc(100vh - ${headerHeight}px)`;
        }

        main.style.display = "flex";
        main.style.alignItems = "center";
        main.style.justifyContent = "center";

        return main;
    } catch (error) {
        console.error("Error in mainToCenter:", error);
    }
};

export const mainToStart = (auth=false) => {
    try {
        const main = document.querySelector("main");
        const headerHeight = document.querySelector("header").offsetHeight;

        if (auth) {
            main.style.position = "absolute";
            main.style.left = "0px";
            main.style.transform = "none";
            main.style.textAlign = "left";
        }
        else {
            main.style.position = "relative";
        }

        main.style.top = `${headerHeight}px`;
        main.style.height = `calc(100vh - ${headerHeight}px)`;
        main.style.display = "flex";
        main.style.alignItems = "center";
        main.style.justifyContent = "flex-start";

        return main;
    } catch (error) {
        console.error("Error in mainToStart:", error);
    }
};