import React, {useState} from "react";
import { graphql, Link } from "gatsby";
import { StoreContext } from "../context/store-context";
import { GatsbyImage } from "gatsby-plugin-image";
import { getShopifyImage } from "gatsby-source-shopify";
import { formatPrice } from "../utils/format-price";
import {
  productCardStyle,
  productHeadingStyle,
  productImageStyle,
  productDetailsStyle,
  productVendorStyle,
  productPrice,
} from "./product-card.module.css"

export function ProductCard({ product, eager }) {
  const [count, setCount] = useState(1)
  const { addVariantToCart, loading } = React.useContext(StoreContext)
  function addToCart(e, variantId, quantity) {
    quantity = count; 
    e.preventDefault()
    addVariantToCart(variantId, quantity)
  }
  const images = [product.featuredImage];
  const {
    title,
    priceRangeV2,
    id,
    shopifyId,
    vendor,
  } = product;
  const price = formatPrice(
    'GBP',
    priceRangeV2.minVariantPrice.amount
  )
  const defaultImageHeight = 200
  const defaultImageWidth = 200
  let hasImage = true;
  console.log(count)
  return (
    <React.Fragment>
      {hasImage
        ? (
          <div className={productImageStyle} data-name="product-image-box">
            <GatsbyImage
              alt={images[0]?.altText ?? title}
              image={images[0]?.gatsbyImageData}
              loading={eager ? "eager" : "lazy"}
            />
          </div>
        ) : (
          <div style={{ height: defaultImageHeight, width: defaultImageWidth }} />
        )
      }
      <div className={productDetailsStyle}>
        <div className={productVendorStyle}>{vendor}</div>
        <h2 as="h2" className={productHeadingStyle}>
          {title}
        </h2>
        <div className={productPrice}>{price}</div>

        <div className="add">
          <div className="col">
            <button
            className="changeInput small"
            onClick={(e) => {
              if (count > 0) {
                let newNum = count - 1;
                setCount(newNum)
              }
            }}
            >-</button>
            <input className="numberInput medium" 
            type="number" min="1" max="100" value={count} />
            <button
            className="changeInput small"
            onClick={(e) => {
                let newNum = count + 1;
                setCount(newNum)
            }}
            >+</button>
          </div>
          <button
          onClick={(e) => addToCart(e, product.variants[0].storefrontId)}
          style={{background: 'black', color: 'white',
          fontFamily: 'Manrope', paddingLeft: 15, paddingRight: 15,
          paddingTop: 9, paddingBottom: 9, borderRadius: 4, marginTop: 0,
          fontSize: 15, fontWeight: 200
          }}
          >Add To Cart</button>
        </div>
      </div>
    </React.Fragment>
  )
}

export const query = graphql`
  fragment ProductCard on ShopifyProduct {
    id
    title
    images {
      id
      altText
      gatsbyImageData(aspectRatio: 1, width: 640)
    }
    priceRangeV2 {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    vendor
  }
`
