import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ListOfFullPaymentsRenderer from "../ListOfFullPaymentsRenderer"
import { getPaymentsInfo } from "../../redux/actions/adminActions";
const AdminReports = () => {
  const dispatch = useDispatch()
  const [type, setType] = useState("");
  useEffect(() => {
    console.log(type)
  }, [type]);

  const adminId = useSelector((state) => state.auth.loggedUser._id);

  useEffect(() => {
    dispatch(getPaymentsInfo(adminId))
    console.log('entro al useEffect de getPaymentsInfo en adminPayments');
  }, []);

  const arrayOfPayments = useSelector((state) => state.admin.payments);

let arr = [{
  _id: "62f1d6f8d55c9253c87a6c3b",
  paymentId: "pi_3LUjI4FSz33wG2Vo0Ue6nS0Y",
  userId: {
    _id: '62e80a1240e56ae280107b26',
    email: 'zeusvargas26@gmail.com',
    firstname: 'Zeus',
    lastname: 'V A'
  },
  amount: 300,
  plan: 'weekly',
  paymentDate: '2022-08-09T03:39:36.172Z',
  paymentStatus: 'succeeded'
},
{
  _id: "62f1d6f8d55c9253c87a6c3b",
  paymentId: "pi_3LUjI4FSz33wG2Vo0Ue6nS0Y",
  userId: {
    _id: '62e80a1240e56ae280107b26',
    email: 'zeusvargas26@gmail.com',
    firstname: 'Zeus',
    lastname: 'V A'
  },
  amount: 300,
  plan: 'weekly',
  paymentDate: '2022-08-09T03:39:36.172Z',
  paymentStatus: 'succeeded'
},
{
  _id: "62f1d6f8d55c9253c87a6c3b",
  paymentId: "pi_3LUjI4FSz33wG2Vo0Ue6nS0Y",
  userId: {
    _id: '62e80a1240e56ae280107b26',
    email: 'zeusvargas26@gmail.com',
    firstname: 'Zeus',
    lastname: 'V A'
  },
  amount: 300,
  plan: 'weekly',
  paymentDate: '2022-08-09T03:39:36.172Z',
  paymentStatus: 'succeeded'
},
{
  _id: "62f1d6f8d55c9253c87a6c3b",
  paymentId: "pi_3LUjI4FSz33wG2Vo0Ue6nS0Y",
  userId: {
    _id: '62e80a1240e56ae280107b26',
    email: 'zeusvargas26@gmail.com',
    firstname: 'Zeus',
    lastname: 'V A'
  },
  amount: 300,
  plan: 'weekly',
  paymentDate: '2022-08-09T03:39:36.172Z',
  paymentStatus: 'succeeded'
},
{
  _id: "62f1d6f8d55c9253c87a6c3b",
  paymentId: "pi_3LUjI4FSz33wG2Vo0Ue6nS0Y",
  userId: {
    _id: '62e80a1240e56ae280107b26',
    email: 'zeusvargas26@gmail.com',
    firstname: 'Zeus',
    lastname: 'V A'
  },
  amount: 300,
  plan: 'weekly',
  paymentDate: '2022-08-09T03:39:36.172Z',
  paymentStatus: 'succeeded'
},
{
  _id: "62f1d6f8d55c9253c87a6c3b",
  paymentId: "pi_3LUjI4FSz33wG2Vo0Ue6nS0Y",
  userId: {
    _id: '62e80a1240e56ae280107b26',
    email: 'zeusvargas26@gmail.com',
    firstname: 'Zeus',
    lastname: 'V A'
  },
  amount: 300,
  plan: 'weekly',
  paymentDate: '2022-08-09T03:39:36.172Z',
  paymentStatus: 'succeeded'
},
{
  _id: "62f1d6f8d55c9253c87a6c3b",
  paymentId: "pi_3LUjI4FSz33wG2Vo0Ue6nS0Y",
  userId: {
    _id: '62e80a1240e56ae280107b26',
    email: 'zeusvargas26@gmail.com',
    firstname: 'Zeus',
    lastname: 'V A'
  },
  amount: 300,
  plan: 'weekly',
  paymentDate: '2022-08-09T03:39:36.172Z',
  paymentStatus: 'succeeded'
},
{
  _id: "62f1d6f8d55c9253c87a6c3b",
  paymentId: "pi_3LUjI4FSz33wG2Vo0Ue6nS0Y",
  userId: {
    _id: '62e80a1240e56ae280107b26',
    email: 'zeusvargas26@gmail.com',
    firstname: 'Zeus',
    lastname: 'V A'
  },
  amount: 300,
  plan: 'weekly',
  paymentDate: '2022-08-09T03:39:36.172Z',
  paymentStatus: 'succeeded'
},
{
  _id: "62f1d6f8d55c9253c87a6c3b",
  paymentId: "pi_3LUjI4FSz33wG2Vo0Ue6nS0Y",
  userId: {
    _id: '62e80a1240e56ae280107b26',
    email: 'zeusvargas26@gmail.com',
    firstname: 'Zeus',
    lastname: 'V A'
  },
  amount: 300,
  plan: 'weekly',
  paymentDate: '2022-08-09T03:39:36.172Z',
  paymentStatus: 'succeeded'
},
{
  _id: "62f1d6f8d55c9253c87a6c3b",
  paymentId: "pi_3LUjI4FSz33wG2Vo0Ue6nS0Y",
  userId: {
    _id: '62e80a1240e56ae280107b26',
    email: 'zeusvargas26@gmail.com',
    firstname: 'Zeus',
    lastname: 'V A'
  },
  amount: 300,
  plan: 'weekly',
  paymentDate: '2022-08-09T03:39:36.172Z',
  paymentStatus: 'succeeded'
},
{
  _id: "62f1d6f8d55c9253c87a6c3b",
  paymentId: "pi_3LUjI4FSz33wG2Vo0Ue6nS0Y",
  userId: {
    _id: '62e80a1240e56ae280107b26',
    email: 'zeusvargas26@gmail.com',
    firstname: 'Zeus',
    lastname: 'V A'
  },
  amount: 300,
  plan: 'weekly',
  paymentDate: '2022-08-09T03:39:36.172Z',
  paymentStatus: 'succeeded'
},
{
  _id: "62f1d6f8d55c9253c87a6c3b",
  paymentId: "pi_3LUjI4FSz33wG2Vo0Ue6nS0Y",
  userId: {
    _id: '62e80a1240e56ae280107b26',
    email: 'zeusvargas26@gmail.com',
    firstname: 'Zeus',
    lastname: 'V A'
  },
  amount: 300,
  plan: 'weekly',
  paymentDate: '2022-08-09T03:39:36.172Z',
  paymentStatus: 'succeeded'
},
{
  _id: "62f1d6f8d55c9253c87a6c3b",
  paymentId: "pi_3LUjI4FSz33wG2Vo0Ue6nS0Y",
  userId: {
    _id: '62e80a1240e56ae280107b26',
    email: 'zeusvargas26@gmail.com',
    firstname: 'Zeus',
    lastname: 'V A'
  },
  amount: 300,
  plan: 'weekly',
  paymentDate: '2022-08-09T03:39:36.172Z',
  paymentStatus: 'succeeded'
},
{
  _id: "62f1d6f8d55c9253c87a6c3b",
  paymentId: "pi_3LUjI4FSz33wG2Vo0Ue6nS0Y",
  userId: {
    _id: '62e80a1240e56ae280107b26',
    email: 'zeusvargas26@gmail.com',
    firstname: 'Zeus',
    lastname: 'V A'
  },
  amount: 300,
  plan: 'weekly',
  paymentDate: '2022-08-09T03:39:36.172Z',
  paymentStatus: 'succeeded'
}]
  return (
    <>
      <div className="li-payments-header-container">
              <div className="text-center">#</div>
              <div className="text-center">Fullname</div>
              <div className="li-payments-header-ids text-center">Ids</div>
              <div className="text-center px-4">Amount</div>
              <div className="text-center li-payments-header-plan">Plan</div>
              <div className="text-center li-payments-header-date">Date</div>
              <div className="text-center li-payments-header-status">Status</div>
      </div>
      <div className="flex items-center justify-center text-slate-100 bg-[#2E2E2E]  shadow-xl rounded-lg '">
        <div>
          <ListOfFullPaymentsRenderer
            arrayOfPayments={arrayOfPayments}
          />
        </div>
      </div>
    </>
  );
};

export default AdminReports;
