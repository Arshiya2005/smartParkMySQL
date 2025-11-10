import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LandingPage from './pages/LandingPage';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Refund from './pages/Refund';
import LoginUser from './pages/LoginUser';
import SignUpUser from './pages/SignUpUser';
import CustomerHome from './pages/Customer/CustomerHome';
import CustomerProfile from './pages/Customer/CustomerProfile';
import MakeNewBooking from './pages/Customer/MakeNewBooking';
import MyActiveBookings from './pages/Customer/MyActiveBookings';
import CustomerInfo from './pages/Customer/CustomerInfo';
import CustomerNotifications from './pages/Customer/CustomerNotifications';
import CustomerHistory from './pages/Customer/CustomerHistory';
import CustomerVehicles from './pages/Customer/CustomerVehicles';
import OwnerHome from './pages/Owner/OwnerHome';
import BookingForm from './pages/Customer/BookingForm';
import NearbySpots from "./pages/Customer/NearbySpots";
import NearbyMap from './components/NearbyMap';
import ConfirmBooking from './pages/Customer/confirmBooking';
import ChooseSlot from './pages/Customer/ChooseSlot';
import PaymentsPage from './pages/Customer/PaymentsPage';
import BookingDetails from './pages/Customer/BookingDetails';
import CancelBooking from './pages/Customer/CancelBooking';
import HistoryBookingDetails from './pages/Customer/historyBookingDetails';
import BookingReminderListener from './components/BookingReminderListener';
import OwnerProfile from './pages/Owner/OwnerProfile';
import OwnerHistory from './pages/Owner/OwnerHistory';
import OwnerNotifications from './pages/Owner/OwnerNotifications';
import OwnerInfo from './pages/Owner/OwnerInfo';
import AddArea from './pages/Owner/AddArea';
import MyArea from './pages/Owner/MyArea';
import AreaDetails from './pages/Owner/AreaDetails';
import SpecificArea from './pages/Owner/SpecificArea';
import AreaHistory from './pages/Owner/AreaHistory';
import AreaActiveBookings from './pages/Owner/AreaActiveBookings';
//now admin routes
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProfile from './pages/Admin/AdminProfile';
import OwnerManagement from './pages/Admin/OwnerManagement';
import CustomerManagement from './pages/Admin/CustomerManagement';
import SpecificCustomer from './pages/Admin/SpecificCustomer';

import SpecificCustVehicles from "./pages/Admin/SpecificCustVehicles";
import SpecificCustHistory from "./pages/Admin/SpecificCustHistory";
import SpecificCustActive from './pages/Admin/SpecificCustActive';
import SpecificOwner from './pages/Admin/SpecificOwner';
import OwnerActiveBookings from './pages/Admin/OwnerActiveBookings';
import OwnerBookingHistory from './pages/Admin/OwnerBookingHistory';
import OwnerAreas from './pages/Admin/OwnerAreas';
import RazorpayPayment from './pages/Customer/RazorPayPayment';
import ContactUs from './pages/ContactUs';
import BookingDetailsO from './pages/Owner/BookingDetailsO';
function App() {
  return (
    <>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/contact" element={<ContactUs/>}/>
        <Route path="/login" element={<LoginUser />} />
        <Route path="/signup" element={<SignUpUser />} />
        <Route path="/customer" element={<CustomerHome />} />
        
        <Route path="/customer/profile" element={<CustomerProfile />}>
          <Route index element={<CustomerInfo />} />
          <Route path="info" element={<CustomerInfo />} />
          <Route path="history" element={<CustomerHistory />} />
          <Route path="notifications" element={<CustomerNotifications />} />
          <Route path="vehicles" element={<CustomerVehicles />} />
          <Route path="historydetails" element={<HistoryBookingDetails />} />
        </Route>
        
        <Route path="/customer/activebookings" element={<MyActiveBookings />} />
        <Route path="/customer/newbooking" element={<MakeNewBooking />} />
        <Route path="/customer/nearby" element={<NearbySpots />} />
        <Route path="/customer/chooseslot" element={<ChooseSlot />} />
        <Route path="/customer/confirm" element={<ConfirmBooking />} />
        <Route path="/customer/pay" element={<PaymentsPage />} />
        <Route path="/customer/bookingdetails" element={<BookingDetails />} />
        <Route path="/customer/razorpay" element={<RazorpayPayment/>} />
        <Route path="customer/cancelBooking" element={<CancelBooking />} />
       
        <Route path="/owner" element={<OwnerHome />} />
        <Route path="/owner/profile" element={<OwnerProfile />}>
          <Route index element={<OwnerInfo />} />
          <Route path="info" element={<OwnerInfo />} />
          <Route path="history" element={<OwnerHistory />} />
          <Route path="notifications" element={<OwnerNotifications />} />
        </Route>
        
        <Route path="/owner/addarea" element={<AddArea />} />
        <Route path="/owner/myarea" element={<MyArea />} />
        <Route path="/owner/areaDetails" element={<AreaDetails />} />
        <Route path="/owner/specificArea" element={<SpecificArea />} />
        <Route path="/owner/areaHistory" element={<AreaHistory />} />
        <Route path="/owner/areaActiveBookings" element={<AreaActiveBookings />} />
        //admin routes now
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/owners" element={<OwnerManagement />} />
        <Route path="/admin/customers" element={<CustomerManagement />} />
        <Route path="/admin/specificCustomer" element={<SpecificCustomer />}>
  <Route index element={<SpecificCustActive />} />
  <Route path="active" element={<SpecificCustActive />} />
  <Route path="vehicles" element={<SpecificCustVehicles />} />
  <Route path="history" element={<SpecificCustHistory />} />
</Route>
<Route path="/admin/specificOwner" element={<SpecificOwner />}>
  <Route index element={<OwnerAreas />} />
  <Route path="areas" element={<OwnerAreas />} />
  <Route path="active" element={<OwnerActiveBookings />} />
  <Route path="history" element={<OwnerBookingHistory />} />
</Route>
<Route path="/owner/booking/details" element={<BookingDetailsO/>}/>
      </Routes>
    </>
  );
}

export default App;