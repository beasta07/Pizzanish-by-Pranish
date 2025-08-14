
export default async function  getPastOrder (order) {
 const response = await fetch(`/api/past-order/${order}`)
 const data = response.json()
 return data

}

