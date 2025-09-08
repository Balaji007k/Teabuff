export default function LoadingPage(Home){
    return(
        <div className={`position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center ${Home&&Home?.Home?'':'bg-dark bg-opacity-75'} z-3`}><div className="loader"></div></div>
    )
}