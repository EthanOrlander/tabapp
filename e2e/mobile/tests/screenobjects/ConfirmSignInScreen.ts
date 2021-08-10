import Gestures from "../helpers/Gestures";
import AppScreen from "./AppScreen";

class ConfirmSignInScreen extends AppScreen {
    constructor() {
        super('~screen-confirm-sign-in');
    }

    get codeInput() { return $('~input-code') }
    get submitButton() { return $('~button-confirm-sign-in'); }

    async submitVerificationForm({ code }: { code: string }): Promise<void> {
        const codeInput = await this.codeInput;
        const submitButton = await this.submitButton;
        await codeInput.setValue(code);
        // For some reason, this is clicking the 'sign up' nav button...? So commenting out for now
        // if (driver.isKeyboardShown())
        //     $(this.selector).click();
        await Gestures.checkIfDisplayedWithSwipeUp(submitButton, 2);
        await submitButton.click();
    }

}

export default new ConfirmSignInScreen();