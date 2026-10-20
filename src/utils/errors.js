/**
 * Błąd z komunikatem przeznaczonym dla użytkownika (np. nieprawidłowe dane wejściowe).
 * Wyświetlany wprost w polu wyniku; pozostałe błędy traktowane są jako nieoczekiwane.
 */
export class UserError extends Error {
    constructor(message) {
        super(message);
        this.name = "UserError";
    }
}
