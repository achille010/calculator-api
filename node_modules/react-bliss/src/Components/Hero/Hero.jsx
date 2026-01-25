import logo from '../img/logo/logo.svg'
import heroImg from '../img/hero/hero-img.svg'
import './Hero.css'

const Hero = () => {
    const navComponents = [
        'Home', 'About', 'Services', 'Portfolio', 'Pricing', 'Team', 'Contact'
    ]
    return(
        <>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Dancing+Script:wght@400..700&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Quicksand:wght@300..700&display=swap" rel="stylesheet" />
            </head>
            <div className='allContainer'>
                <div className='nav'>
                    <div className='bliss-logo'>
                        <img src={logo} alt="Bliss logo" className='logo'/>
                    </div>
                    <div className='nav-components'>
                        {navComponents.map(navComponent => (
                            <a className='nav-component hover-link' href="#">{navComponent}</a>
                        ))}
                    </div>
                </div>
                <div className='mid-hero'>
                    <div className='left'>
                        <div className="welcome">
                            Welcome To Bliss
                        </div>
                        <div className="version">
                            You are using free lite <br /><span style={{marginTop: 5}}>version of Bliss.</span>
                        </div>
                    </div>
                    <div className="right">
                        <img src={heroImg} className='heroImg' alt="Heroooo" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Hero;
