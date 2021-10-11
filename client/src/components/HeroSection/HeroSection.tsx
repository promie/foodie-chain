import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import './herosection.css'
import FoodSupply from '../../assets/food-supply.jpg'

const HeroSection: FC = () => {
  // NOTE: History.push is preferred over href because href causes the page to re-render.
  // Please ignore the warning on the console for now
  const history = useHistory()

  const goToRegulator = () => {
    history.push('/regulator')
  }

  const goToParticipant = () => {
    history.push('/participant')
  }

  // const goToTrace = () => {
  //   history.push('/track')
  // }

  return (
    <section className="hero is-fullheight wrapper">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-vcentered reverse-columns">
            <div
              className="column
          is-10-mobile is-offset-1-mobile
          is-10-tablet is-offset-1-tablet
          is-5-desktop is-offset-1-desktop
          is-5-widescreen is-offset-1-widescreen
          is-5-fullhd is-offset-1-fullhd"
              data-aos="fade-down"
            >
              <h1 className="title titled is-1 mb-6">
                A modern solution for the world’s food supply.
              </h1>
              <h2 className="subtitled subtitle has-text-grey is-4 has-text-weight-normal is-family-sans-serif">
                Join us in creating a smarter, safer, more sustainable food
                system with Blockchain technology.
              </h2>
              <div className="buttons">
                <a
                  href="#"
                  className="button is-primary is-outlined"
                  onClick={goToRegulator}
                >
                  Regulator
                </a>
                <a
                  href="#"
                  className="button is-link is-outlined"
                  onClick={goToParticipant}
                >
                  Participant
                </a>
                {/* <a
                  className="button is-link is-outlined"
                  onClick={goToTrace}
                >
                  Trace
                </a> */}
              </div>
            </div>
            <div
              data-aos="fade-right"
              className="column
          is-10-mobile is-offset-1-mobile
          is-10-tablet is-offset-1-tablet
          is-4-desktop is-offset-1-desktop
          is-4-widescreen is-offset-1-widescreen
          is-4-fullhd is-offset-1-fullhd"
            >
              <figure className="image is-square">
                <img src={FoodSupply} alt="Food Supply chain" />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
