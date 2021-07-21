import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingHorizontal: 20,
    overflow: 'visible',
  },
  title: {
    fontSize: 20,
    color: '#202020',
    fontWeight: '500',
    marginVertical: 15,
  },
  forgotPasswordButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPasswordButtonText: {
    color: '#6425C7',
    fontSize: 18,
    fontWeight: '600',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    textDecorationColor: '#6425C7',
  },
  signUpLinkContainer: {
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  signUpLink: {
    color: '#6425C7',
    fontSize: 18,
    fontWeight: '600',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    textDecorationColor: '#6425C7',
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  inputLabel: {
    fontSize: 18,
    textAlign: 'left',
    alignItems: 'flex-start',
  },
  inputError: {
    display: 'flex',
    fontSize: 12,
    color: 'red',
  },
  submitButtonContainer: {
    width: '100%',
    marginTop: 15,
  },
  footerButtonContainer: {
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordRequirementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  passwordRequirementsBody: {
    fontSize: 16,
  },
  passwordRequirementsContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 10,
    elevation: 2,
  },
});
