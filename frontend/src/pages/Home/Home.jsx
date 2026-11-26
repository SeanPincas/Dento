import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'

const Home = () => {

    const [category,setCategory] = useState('All');
    // Set when a plate is picked off the belt, so FoodDisplay can fly it to the dock.
    const [grab,setGrab] = useState(null);

  return (
    <div>
        <Header setCategory={setCategory}/>
        <ExploreMenu category={category} setCategory={setCategory} onGrab={setGrab}/>
        <FoodDisplay category={category} setCategory={setCategory} grab={grab} />
        <AppDownload/>
    </div>
  )
}

export default Home