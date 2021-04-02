import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client'
import Nav from '../components/navbar'

const AppComponent =  ({Component, pageProps, currentUser}) =>{
    return (
        <div>
            <Nav currentUser={currentUser}></Nav>
            <div className="container">
                <Component currentUser={currentUser} {...pageProps}/>
            </div>
        </div>
    )
}


AppComponent.getInitialProps = async (appContext)=> {
    const client = buildClient(appContext.ctx)
    const {data} = await client.get('/api/users/currentuser')
    let pageProps = {}
    if (appContext.Component.getInitialProps){
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser)
    }
    console.log(pageProps)
    return {pageProps, currentUser: data.currentUser}
}



export default AppComponent
