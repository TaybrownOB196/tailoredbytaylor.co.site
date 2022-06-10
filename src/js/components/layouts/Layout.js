import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import MainContent from '../MainContent';

function Layout() {
    return (
        <div className='grid-container'>
            <Header />
            <MainContent />                
            <Footer />
        </div>
    );
}

export default Layout;