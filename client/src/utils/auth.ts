export const checkAuthentication = (router: any) => {
  const token = localStorage.getItem("token")

  if (token) {
    router.push("/dashboard") 
  } else {
    router.push("/login") 
  }
}
