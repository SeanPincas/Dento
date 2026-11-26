import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import "./FoodDisplay.css"
import { StoreContext } from '../../context/StoreContext'
import { menu_list } from '../../assets/assets'
import FoodItem from '../FoodItem/FoodItem'
import OrderTray from '../OrderTray/OrderTray'
import { CATEGORY_JP } from '../../utils/dishSearch'
import { prefersReducedMotion } from '../../utils/motion'
import CeramicPlate from '../ui/CeramicPlate/CeramicPlate'
import { ChopsticksIcon } from '../ui/Icons/Icons'

const FLIGHT_MS = 900    // plate flight from the belt to the dock
const FLYER_SIZE = 160   // rendered size of the flying plate before scaling

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

const FoodDisplay = ({ category, setCategory, grab }) => {

  const { food_list, locateRequest, setLocateRequest } = useContext(StoreContext)
  const [locatedId, setLocatedId] = useState(null)
  const locateTimer = useRef(null)
  const [inFlight, setInFlight] = useState(false)
  const [landKey, setLandKey] = useState(0)

  const sectionRef = useRef(null)
  const slotRef = useRef(null)
  const flyerRef = useRef(null)
  const flyerImgRef = useRef(null)

  const dishes = useMemo(
    () => food_list.filter((item) => category === 'All' || item.category === category),
    [food_list, category]
  )

  const isAll = category === 'All'
  const categoryImage = menu_list.find((m) => m.menu_name === category)?.menu_image

  // Fly the grabbed plate in a straight line from the belt to the placemat in
  // the dock (no arc or tilt), shrinking as it goes.
  useEffect(() => {
    if (!grab) return
    const reduceMotion = prefersReducedMotion()
    sectionRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    if (reduceMotion || !flyerRef.current || !slotRef.current) {
      setLandKey((k) => k + 1)
      return
    }

    const flyer = flyerRef.current
    flyerImgRef.current.src = grab.img
    flyer.style.display = 'flex'
    setInFlight(true)

    const from = grab.rect
    const fromX = from.left + from.width / 2
    const fromY = from.top + from.height / 2
    const start = performance.now()
    let frame

    const step = (now) => {
      const t = Math.min((now - start) / FLIGHT_MS, 1)
      const e = easeInOutCubic(t)
      // The dock is sticky and the page is scrolling, so aim at where it is now.
      const to = slotRef.current.getBoundingClientRect()
      const toX = to.left + to.width / 2
      const toY = to.top + to.height / 2
      const x = fromX + (toX - fromX) * e
      const y = fromY + (toY - fromY) * e
      const landSize = to.width * 0.79 // the mini plate fills ~79% of the placemat
      const size = from.width + (landSize - from.width) * e
      flyer.style.transform =
        `translate(${x - FLYER_SIZE / 2}px, ${y - FLYER_SIZE / 2}px) scale(${size / FLYER_SIZE})`
      flyer.style.setProperty('--shadow', `${0.15 + Math.sin(Math.PI * t) * 0.35}`)

      if (t < 1) {
        frame = requestAnimationFrame(step)
      } else {
        flyer.style.display = 'none'
        setInFlight(false)
        setLandKey((k) => k + 1)
      }
    }
    frame = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(frame)
      flyer.style.display = 'none'
      setInFlight(false)
    }
  }, [grab?.id])

  // From the order slip: show the dish's card (clearing a filter that hides
  // it), scroll to it and highlight it with its panel open.
  const locateDish = (itemId) => {
    const visible = dishes.some((item) => item._id === itemId)
    if (!visible) setCategory?.('All')
    setLocatedId(itemId)
    clearTimeout(locateTimer.current)
    locateTimer.current = setTimeout(() => setLocatedId(null), 2600)
    // wait a frame so a just-unfiltered card exists before scrolling to it
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.getElementById(`dish-${itemId}`)?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'center',
      })
    }))
  }

  useEffect(() => () => clearTimeout(locateTimer.current), [])

  // A line tapped in the slip sheet (phones and tablets).
  useEffect(() => {
    if (!locateRequest || food_list.length === 0) return
    locateDish(locateRequest.itemId)
    setLocateRequest(null)
  }, [locateRequest, food_list.length])

  const resetAll = () => setCategory?.('All')

  const showPlate = !isAll && categoryImage && !inFlight

  return (
    <section className='food-display' id='food-display' ref={sectionRef}>
      <div className='food-display-layout'>
      {/* Sidebar dock: the "table" the grabbed plate lands on and the category
          ribbon. Stays pinned under the navbar. (Dish search lives in the
          navbar, the hero and the bottom nav.) */}
      <div className='food-sidebar'>
      <aside className='food-dock' aria-label='Dish filters'>
        <div className='food-dock-mat' ref={slotRef}>
          {showPlate ? (
            <CeramicPlate key={landKey} src={categoryImage} size={60} className='food-dock-plate' />
          ) : (
            <span className='food-dock-mat-empty' aria-hidden='true'>
              <ChopsticksIcon size={22} />
            </span>
          )}
        </div>

        <div className='food-dock-info'>
          <h2>Top Japanese Dishes</h2>
          <div className='food-dock-ribbon' aria-live='polite'>
            <span className='food-dock-ribbon-jp'>{CATEGORY_JP[category] ?? ''}</span>
            <span className='food-dock-ribbon-name'>{isAll ? 'All dishes' : category}</span>
            <span className='food-dock-ribbon-count'>{dishes.length} {dishes.length === 1 ? 'dish' : 'dishes'}</span>
            {!isAll && (
              <button type='button' className='food-dock-clear' aria-label={`Clear ${category} filter`} onClick={() => setCategory?.('All')}>×</button>
            )}
          </div>
          {isAll && <span className='food-dock-hint'>Grab a plate from the belt to filter</span>}
        </div>

      </aside>

      {/* Running order list under the dock (wide screens). */}
      <OrderTray onLocate={locateDish} />
      </div>

      <div className='food-display-main'>
      {dishes.length > 0 ? (
        <div className="food-display-list">
          {dishes.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              category={item.category}
              rating={item.rating}
              located={locatedId === item._id}
            />
          ))}
        </div>
      ) : (
        <div className='food-display-empty'>
          <p>
            No dishes in {isAll ? 'the menu' : category} yet.
          </p>
          <button type='button' onClick={resetAll}>Show all dishes</button>
        </div>
      )}
      </div>
      </div>

      {/* The plate in flight, drawn above everything else on the page. */}
      {createPortal(
        <div className='ceramic-plate flying-plate' ref={flyerRef} aria-hidden='true'>
          <img ref={flyerImgRef} alt='' />
        </div>,
        document.body
      )}
    </section>
  )
}

export default FoodDisplay
