import React, { useState, useEffect } from 'react';
import './Shop.css';
import Product from '../Product/Product';
import Cart from '../Cart/Cart';
import { addToDb, getShoppingCart } from '../utilities/fakedb';

const Shop = () => {
    const [products, setProducts]=useState([]);
    const [cart, setCart]=useState([]);
    useEffect(()=>{
        fetch('products.json')
        .then(res => res.json())
        .then(data => setProducts(data))
    },[]);
    const handleAddToCart=(product)=>{
        //cart.push(product)
        let newCart=[];
        // const newCart=[...cart,product];
        //If product doesn't exists in the cart, then set quantity=1
        //If product exists, update the quantity by 1
        const exists=cart.find(pd => pd.id===product.id);
        if(!exists){
            product.quantity=1;
            newCart=[...cart,product];
        }
        else{
            exists.quantity=exists.quantity+1;
            const remaining=cart.filter(pd => pd.id !==product.id);
            newCart=[...remaining,exists];
        }

        setCart(newCart);
        addToDb(product.id);
    }
    useEffect(()=>{
        const storedCart=getShoppingCart();
        const savedCart=[];
        //step 1: get id of the addedProduct
        for(const id in storedCart){
            //step2: get product from products state by using id
            const addedProduct=products.find(product => product.id===id);
            if(addedProduct){
                //step3: add quantity
                const quantity=storedCart[id];
                addedProduct.quantity=quantity;
                savedCart.push(addedProduct);
            }
            console.log('Added Product',addedProduct);
        }
        setCart(savedCart);
    },[products])
    return (
        <div className='shop-container'>
            <div className='products-container'>
            {
                products.map(product => <Product
                key={product.id}
                product={product}
                handleAddToCart={handleAddToCart}
                ></Product>)
            }
            </div>
            <div className='cart-container'>
                <Cart cart={cart}></Cart>
            </div>
        </div>
    );
};
export default Shop;