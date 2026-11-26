import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'
import BambooGrove from '../BambooGrove/BambooGrove'
import KaitenBelt from './KaitenBelt'
import KaitenLoop from './KaitenLoop'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const NOREN = ['い', 'ら', 'っ', 'しゃ', 'い'] // irasshai: "welcome"

// Shadows of bamboo outside the shoji: stalks (left %, width px, tilt deg) and leaves.
const KAGE_STALKS = [[12, 16, 2], [17, 10, -1], [28, 13, 3], [66, 12, -2], [75, 18, 1], [84, 10, -3]]
const KAGE_LEAVES = [[11, 130, -35], [15, 190, 25], [27, 100, -20], [30, 170, 30], [65, 120, 20], [68, 200, -30], [76, 80, -25], [82, 160, 35]]


const ExploreMenu = ({ category, setCategory, onGrab }) => {
  // Picking a plate selects its category and hands its position to FoodDisplay,
  // which flies a copy of the plate down to the dock. Picking it again clears it.
  const pick = (item, button) => {
    const next = category === item.menu_name ? 'All' : item.menu_name
    setCategory(next)
    if (next !== 'All') {
      const plate = button.querySelector('.kaiten-plate')
      onGrab?.({ id: Date.now(), img: item.menu_image, rect: plate.getBoundingClientRect() })
    }
  }

  // Phones get a two-tier counter with the plates running round one loop,
  // so the plates can stay a comfortable size on a narrow screen.
  const twoTier = useMediaQuery('(max-width: 750px)')

  return (
    <section className='explore-menu' id='explore-menu'>
      {/* Shoji wall decor (design E): transom, bamboo shadows on the paper and
          bamboo poles at the sides. Purely decorative, drawn with CSS. */}
      <div className='shoji-wall' aria-hidden='true'>
        <div className='shoji-kage'>
          {KAGE_STALKS.map(([left, width, tilt], i) => (
            <span key={`s${i}`} className='shoji-kage-stalk' style={{ left: `${left}%`, width, transform: `rotate(${tilt}deg)` }} />
          ))}
          {KAGE_LEAVES.map(([left, top, tilt], i) => (
            <span key={`l${i}`} className='shoji-kage-leaf' style={{ left: `${left}%`, top, transform: `rotate(${tilt}deg)` }} />
          ))}
        </div>
        <div className='shoji-ranma' />
      </div>

      {/* Realistic bamboo groves at both sides, rising into the hero. */}
      <BambooGrove />

      <div className='explore-menu-noren' aria-hidden='true'>
        {NOREN.map((char, i) => <span key={i}>{char}</span>)}
      </div>

      <div className='explore-menu-heading'>
        <h1>Take a seat at the counter</h1>
        <p className='explore-menu-text'>Every category rides past on its own plate. Pick one up to explore that part of the menu.</p>
      </div>

      <div className='kaiten-lanes'>
        {twoTier ? (
          <KaitenLoop items={menu_list} category={category} onPick={pick} />
        ) : (
          <KaitenBelt items={menu_list} category={category} onPick={pick} label='Categories' />
        )}
      </div>

      {/* Brick walkway in front of the counter. */}
      <div className='explore-menu-floor' aria-hidden='true' />
    </section>
  )
}

export default ExploreMenu
