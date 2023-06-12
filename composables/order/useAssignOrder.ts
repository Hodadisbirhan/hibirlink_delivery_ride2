import assigned_order_to_driver from "~/apollo/mutation/driver/assigned_order_todriver.gql";

export default ()=>{

const {
  mutate: assignOrder,
  onDone: onAssignedOrderCompleted,
  onError: onAssignedOrderError,
  
} = useCustomMutation(assigned_order_to_driver);

}