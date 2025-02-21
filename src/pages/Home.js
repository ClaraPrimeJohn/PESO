import React from 'react'
import Hero from '../components/Hero'
import Heromid from '../components/Heromid'
// import Heroservice from '../components/Heroservice'
import HeroJoblistings from '../components/HeroJoblisting'
import HeroJobApplications from '../components/HeroJobApplication'
import HeroNotif from '../components/HeroNotif'
import HeroAnnouncement from '../components/HeroAnnouncement'
import PageLoader from '../components/PageLoader'
import HeroLast from '../components/HeroLast'

const Home = () => { 
    return (
        <PageLoader>  
            <div>
                <Hero />
                <Heromid />
                <HeroJoblistings />
                <HeroJobApplications />
                <HeroAnnouncement />
                <HeroNotif />
                <HeroLast />
            </div>
        </PageLoader>
    )
}

export default Home