import LogoutLink from "../Components/LogoutLink.tsx";
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import OsAlgorithmTrainer from './AlgorithmTrainerPage/Trainer.tsx';

function Home() {
    return (
        <AuthorizeView>
            <h1>Welcome Student</h1>
            <span><LogoutLink>Logout <AuthorizedUser value="email" /></LogoutLink></span>
            <OsAlgorithmTrainer />
        </AuthorizeView>
    );
}

export default Home;