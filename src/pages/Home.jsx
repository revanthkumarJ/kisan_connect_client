import Carousel from '../components/Carousel';
import ProductPage from './ProductsPage'
import Footer from '../components/Footer';
import React from 'react'
function Home(){
    return(
        <div style={{width:'100%'}}>
        <Carousel/>
        <ProductPage />
        <Footer/>
        </div>

    )
}
export default Home;