import{
    useState,
    type ChangeEvent,
    type SyntheticEvent,
} from 'react';


import{
    forgotPassword,
} from '../services/authService';


export default function ForgotPasswordPage(){

    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    function handleEmailChange(
        event: ChangeEvent<HTMLInputElement>,
    ){
        setEmail(event.target.value);
    }

    async function handleSubmit(
        event: SyntheticEvent<HTMLFormElement>
    ){
        event.preventDefault();

        try{
            setIsSubmitting(true);
            setError(null);
            setMessage(null);

            const response = await forgotPassword(
                email
            )

            setMessage(response);
        }
        catch(caughtError){
            if(caughtError instanceof Error){
                setError(caughtError.message)
            }
            else{
                setError(
                    'Nie udało się wysłać wiadomości.',
                );
            }
        }
        finally{
            setIsSubmitting(false);
        }
    }

    return(
        <section>
            <h1>Odzyskiwanie hasła</h1>
            {error &&(
                <p className='error-message'>
                    {error}
                </p>
            )}

            {message && (
                <p className="success-message">
                    {message}
                </p>
)}

            <form className='car-form' onSubmit={handleSubmit}>
                <label>
                    E-mail
                    <input 
                    type="email" 
                    value={email} 
                    onChange={handleEmailChange}
                    required
                    />
                </label>

                <button
                type="submit"
                disabled={isSubmitting}
                >
                    {isSubmitting 
                    ? 'Wysyłanie linku...' 
                    : 'Wyślij link'}
                </button>
            </form>
        </section>
    );
}