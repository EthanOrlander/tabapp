import Gestures from "../helpers/Gestures";
import AppScreen from "./AppScreen";

class SignInScreen extends AppScreen {
    constructor() {
        super('~screen-sign-in');
    }

    get phoneNumberInput() { return $('~input-phone-number') }
    get passwordInput() { return $('~input-password') }
    get signInButton() { return $('~button-sign-in'); }
    get signUpButton() { return $('~button-sign-up'); }
    get forgotPasswordButton() { return $('~button-forgot-password'); }

    async submitSignInForm({ phoneNumber, password }: { phoneNumber: string, password: string }): Promise<void> {
        const phoneNumberInput = await this.phoneNumberInput;
        const passwordInput = await this.passwordInput;
        const signInButton = await this.signInButton;
        await phoneNumberInput.setValue(phoneNumber);
        await passwordInput.setValue(password);
        // For some reason, this is clicking the 'sign up' nav button...? So commenting out for now
        // if (driver.isKeyboardShown())
        //     $(this.selector).click();
        await Gestures.checkIfDisplayedWithSwipeUp(signInButton, 2);
        await signInButton.click();
    }

}

export default new SignInScreen();