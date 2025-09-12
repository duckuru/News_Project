export default function Profile(props: {user: any; onLogout: any;}){
    const { user, onLogout } = props;
    
    return(
        <main className="profile-page">
            {/* testing, user info display */}
            <h1>{user.user?.username}</h1>
            <button onClick={onLogout}>logout</button>
        </main>
    );
}