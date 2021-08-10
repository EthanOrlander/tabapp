export default class AppScreen {
    selector: string;

    constructor(selector: string) {
        this.selector = selector;
    }

    async waitForIsShown(isShown = true): Promise<boolean | void> {
        return await (await $(this.selector)).waitForDisplayed({
            reverse: !isShown,
        });
    }
}