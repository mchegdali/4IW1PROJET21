import vine, { SimpleMessagesProvider } from '@vinejs/vine';

/**
 * Initialize various parts of the application
 */
function init() {
  vine.messagesProvider = new SimpleMessagesProvider({
    // Applicable for all fields
    required: 'Le champ {{ field }} est requis',
    string: 'La valeur du champ {{ field }} doit être une chaîne de caractères',
    email: "La valeur n'est pas une adresse email valide",
    number: 'La valeur du champ {{ field }} doit être un nombre',
  });
}

export default init;
