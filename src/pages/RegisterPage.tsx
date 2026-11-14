import{
    useState,
    type ChangeEvent,
    type SyntheticEvent,
} from 'react';

import{
    useNavigate,
} from 'react-router';

import{
    register
} from '../services/authService';

import{
    useAuthStore
} from '../store/useAuthStore';

export default function RegisterPage(){
    const navigate = useNavigate();

    const setUser = useAuthStore(
        (state) => state.setUser,
    );

    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    function handleUserNameChange(
        event: ChangeEvent<HTMLInputElement>,
    ){
        setUserName(event.target.value);
    }
    
    function handleEmailChange(
        event: ChangeEvent<HTMLInputElement>,
    ){
        setEmail(event.target.value);
    }
    
    function handlePasswordChange(
        event: ChangeEvent<HTMLInputElement>
    ){
        setPassword(event.target.value)
    }

    async function handleSubmit(
        event: SyntheticEvent<HTMLFormElement>
    ){
        event.preventDefault();

        try{
            setIsSubmitting(true);
            setError(null);

            const user = await register({
                userName,
                email,
                password,
            });

            setMessage(user);
            navigate('/login');
        }
        catch(caughtError){
            if(caughtError instanceof Error){
                setError(caughtError.message)
            }
            else{
                setError(
                    'Nie udało się zarejestrować.',
                );
            }
        }
        finally{
            setIsSubmitting(false);
        }
    }

    return(
        <section>
            <h1>Rejestrowanie</h1>
            {error &&(
                <p className='error-message'>
                    {error}
                </p>
            )}

            <form className='car-form' onSubmit={handleSubmit}>
                <label>
                    UserName
                    <input 
                    type="userName" 
                    value={userName} 
                    onChange={handleUserNameChange}
                    required
                    />
                </label>
                <label>
                    E-mail
                    <input 
                    type="email" 
                    value={email} 
                    onChange={handleEmailChange}
                    required
                    />
                </label>
                <label>
                    Hasło

                    <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    />
                </label>

                <button
                type="submit"
                disabled={isSubmitting}
                >
                    {isSubmitting 
                    ? 'Rejestrowanie...' 
                    : 'Zarejestruj'}
                </button>
            </form>
        </section>
    );
}