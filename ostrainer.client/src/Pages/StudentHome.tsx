import WeatherForecast from "../Components/WeatherForecast.tsx";
import LogoutLink from "../Components/LogoutLink.tsx";
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";

function Home() {
    return (
        <AuthorizeView>
            <h1>Welcome Student</h1>
            <span><LogoutLink>Logout <AuthorizedUser value="email" /></LogoutLink></span>
            <WeatherForecast />
        </AuthorizeView>
    );
}

export default Home;