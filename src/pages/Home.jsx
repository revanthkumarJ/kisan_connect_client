import Carousel from '../components/Carousel';
import ProductPage from './ProductsPage'
import Footer from '../components/Footer';
import React from 'react'
import { useAuth } from './AuthContext';


function Home(){
    const {mode}=useAuth()
    return(
        <div style={{width:'100%',color: mode === 'light' ? '#000' : '#fff',background: mode === 'light' ? '#fff' : '#424242'}}>
        <Carousel/>
        <ProductPage />
        <Footer/>
        </div>

    )
}
export default Home;