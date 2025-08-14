import { useState,Suspense,use } from "react";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import getPastOrders from "../api/getPastOrders";
import getPastOrder from '../api/getPastOrder'
import Modal from '../Modal'
import useCurrency, { priceConverter } from "../useCurrency";
import ErrorBoundary from "../ErrorBoundary";

export const Route = createLazyFileRoute("/past")({
  component: ErrorBoundaryWrappedPastOrderRoutes,
});
function ErrorBoundaryWrappedPastOrderRoutes(){
    const [page, setPage] = useState(1);
      const loadingPromise = useQuery({
    queryKey: ["past-orders", page],
    queryFn: () => getPastOrders(page),
  }).promise;

  return(
    <ErrorBoundary>
      <Suspense
      fallback={<div className="past-orders">
        <h2>Loading Past orders...</h2>
      </div>}>

      <PastOrdersRoute loadingPromise={loadingPromise} page={page} setPage={setPage}/>
      </Suspense>
    </ErrorBoundary>
  )
}
function PastOrdersRoute({page,setPage,loadedPromise}) {
  const data = use(loadedPromise)
  const [focusedOrder , setFocusedOrder]= useState()

  const {isLoading: isLoadingPastOrder,data:pastOrderData}= useQuery({
    queryKey:['past-order',focusedOrder],
    queryFn: ()=> getPastOrder(focusedOrder),
    staleTime: 24*60*60, //one day in milliseconds
    enabled: !!focusedOrder
  })

  return (
    <div className="past-orders">
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Date</td>
            <td>Time</td>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => (
            <tr key={order.order_id}>
              <td>
                <button onClick={()=>setFocusedOrder(order.order_id)}></button>
                {order.order_id}
                </td>
              <td>{order.date}</td>
              <td>{order.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pages">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <div>{page}</div>
        <button disabled={data.length < 10} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
      {
        focusedOrder ? (
       <Modal>
        <h2>Order #(focusedOrder)</h2>
        {!isLoadingPastOrder ? (<table>
          <thead>
            <tr>
              <td>Image</td>
              <td>Name</td>
              <td>Size</td>
              <td>Quantity</td>
              <td>Price</td>
              <td>Total</td>
            </tr>
          </thead>
          <tbody>
            {pastOrderData.orderItems.map((pizza)=> (
              <tr key={pizza.pizzaTypeId} >
               <td>
                <img src={pizza.image} alt={pizza.name} />
               </td>
               <td>{pizza.name}</td>
               <td>{pizza.size}</td>
               <td>{pizza.quantity}</td>
               <td>{priceConverter(pizza.price)}</td>
               <td>{priceConverter(pizza.total)}</td>
              </tr>
            )) }
          </tbody>
        </table>): <p>Loading....</p>}
        <button onClick={()=> setFocusedOrder(null)}>Close</button>
       </Modal>
        ): null
      }
    </div>
  );
}