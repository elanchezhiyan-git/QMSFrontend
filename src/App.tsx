import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import {AuthProvider} from './context/AuthContext';
import {ProtectedRoute, PublicRoute} from './router/ProtectedRoute';
import {RoleRedirect} from './router/RoleRedirect';
import {Navbar} from './components/layout/Navbar';
import {Sidebar} from './components/layout/Sidebar';
import {CookieConsent} from './components/common/CookieConsent';

import {HomePage} from './pages/customer/HomePage';
import {TicketStatusPage} from './pages/customer/TicketStatusPage';
import {MyTicketsPage} from './pages/customer/MyTicketsPage';
import {LoginPage} from './pages/auth/LoginPage';
import {CounterSelectionPage} from './pages/agent/CounterSelectionPage';
import {CallTicketPage} from './pages/agent/CallTicketPage';
import {AdminDashboard} from './pages/admin/AdminDashboard';
import {UsersPage} from './pages/admin/UsersPage';
import {CountersPage} from './pages/admin/CountersPage';
import {ManagerDashboard} from './pages/manager/ManagerDashboard';
import {TicketsPage} from './pages/manager/TicketsPage';

import {BarChart3, Monitor, Users} from 'lucide-react';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <CookieConsent/>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                        }}
                    />

                    <Routes>
                        {/* Public Routes */}

                        <Route path="/auth/login" element={
                            <PublicRoute redirectTo="/">
                                <LoginPage/>
                            </PublicRoute>}
                        />

                        {/* Protected Routes with Layout */}
                        <Route
                            path="/*"
                            element={
                                <ProtectedRoute requireAuth={false}>
                                    <div>
                                        <Navbar/>
                                        <Routes>
                                            {/* Customer Routes */}
                                            <Route path="/" element={<HomePage/>}/>
                                            <Route path="/ticket-status" element={<TicketStatusPage/>}/>
                                            <Route path="/my-tickets" element={<MyTicketsPage/>}/>
                                            <Route path="/dashboard" element={<RoleRedirect/>}/>

                                            {/* Agent Routes */}
                                            <Route
                                                path="/agent"
                                                element={
                                                    <ProtectedRoute allowedRoles={['agent']}>
                                                        <CounterSelectionPage/>
                                                    </ProtectedRoute>
                                                }
                                            />
                                            <Route
                                                path="/agent/call"
                                                element={
                                                    <ProtectedRoute allowedRoles={['agent']}>
                                                        <CallTicketPage/>
                                                    </ProtectedRoute>
                                                }
                                            />

                                            {/* Admin Routes */}
                                            <Route
                                                path="/admin/*"
                                                element={
                                                    <ProtectedRoute allowedRoles={['admin', 'manager']}>
                                                        <div className="flex">
                                                            <Sidebar
                                                                links={[
                                                                    {to: '/admin', label: 'Dashboard', icon: BarChart3},
                                                                    {to: '/admin/users', label: 'Users', icon: Users},
                                                                    {
                                                                        to: '/admin/counters',
                                                                        label: 'Counters',
                                                                        icon: Monitor
                                                                    },
                                                                ]}
                                                            />
                                                            <div className="flex-1 p-8">
                                                                <Routes>
                                                                    <Route path="/" element={<AdminDashboard/>}/>
                                                                    <Route path="/users" element={<UsersPage/>}/>
                                                                    <Route path="/counters" element={<CountersPage/>}/>
                                                                </Routes>
                                                            </div>
                                                        </div>
                                                    </ProtectedRoute>
                                                }
                                            />

                                            {/* Manager Routes */}
                                            <Route
                                                path="/manager/*"
                                                element={
                                                    <ProtectedRoute allowedRoles={['manager', 'admin']}>
                                                        <div className="flex">
                                                            <Sidebar
                                                                links={[
                                                                    {
                                                                        to: '/manager',
                                                                        label: 'Dashboard',
                                                                        icon: BarChart3
                                                                    },
                                                                    {
                                                                        to: '/manager/tickets',
                                                                        label: 'Tickets',
                                                                        icon: Users
                                                                    },
                                                                ]}
                                                            />
                                                            <div className="flex-1 p-8">
                                                                <Routes>
                                                                    <Route path="/" element={<ManagerDashboard/>}/>
                                                                    <Route path="/tickets" element={<TicketsPage/>}/>
                                                                </Routes>
                                                            </div>
                                                        </div>
                                                    </ProtectedRoute>
                                                }
                                            />

                                            {/* Unauthorized */}
                                            <Route
                                                path="/unauthorized"
                                                element={
                                                    <div className="text-center py-12">
                                                        <h1 className="text-2xl font-bold text-red-600">Access
                                                            Denied</h1>
                                                        <p className="text-gray-600 mt-2">You don't have permission to
                                                            access this page.</p>
                                                    </div>
                                                }
                                            />
                                        </Routes>
                                    </div>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;