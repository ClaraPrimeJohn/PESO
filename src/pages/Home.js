import React from 'react'
import Hero from '../components/Hero'
import Heromid from '../components/Heromid'
import Heroservice from '../components/Heroservice'
import HeroLast from '../components/HeroLast'

const Home = () => { 
    return (
        <div>
            <Hero />
            <Heromid />
            <Heroservice />
            <HeroLast />
        </div>
    )
}

export default Home