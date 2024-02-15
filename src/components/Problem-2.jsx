import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Problem-2.css';

const Problem2 = () => {
    const [showModalA, setShowModalA] = useState(false);
    const [showModalB, setShowModalB] = useState(false);
    const [showModalC, setShowModalC] = useState(false); // State for Modal C
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [onlyEven, setOnlyEven] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedContact, setSelectedContact] = useState(null); // State to store selected contact for Modal C

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await axios.get('https://contact.mediusware.com/api/contacts/');
            setContacts(response.data.results);
            setFilteredContacts(response.data.results);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const fetchUSContacts = async () => {
        try {
            const response = await axios.get('https://contact.mediusware.com/api/country-contacts/US/');
            setFilteredContacts(response.data.results);
        } catch (error) {
            console.error('Error fetching US contacts:', error);
        }
    };
    

    const handleModalA = () => {
        setShowModalA(true);
        setShowModalB(false); 
        fetchContacts(); 
    };

    const handleModalB = () => {
        setShowModalB(true);
        setShowModalA(false); 
        fetchUSContacts(); 
    };

    const closeModal = () => {
        setShowModalA(false);
        setShowModalB(false);
        setShowModalC(false);
    };

    const handleCheckboxChange = (e) => {
        setOnlyEven(e.target.checked);
        filterContacts(searchTerm, e.target.checked);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        filterContacts(e.target.value, onlyEven); 
    };

    const filterContacts = (term, evenOnly) => {
        let filtered = contacts.filter(contact =>
            contact.id && contact.id % 2 === 0 
        );

        if (term) {
            filtered = filtered.filter(contact =>
                contact.phone.includes(term) ||
                (contact.country && contact.country.name.toLowerCase().includes(term.toLowerCase()))
            );
        }

        setFilteredContacts(filtered);
    };

    const handleContactClick = (contact) => {
        setSelectedContact(contact); 
        setShowModalC(true); 
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <h4 className='text-center text-uppercase mb-5'>Problem-2</h4>
                <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-lg btn-custom-primary" type="button" onClick={handleModalA}>All Contacts</button>
                    <button className="btn btn-lg btn-custom-warning" type="button" onClick={handleModalB}>US Contacts</button>
                </div>
                {(showModalA || showModalB) && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Contacts</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control mb-3" placeholder="Search contacts..." value={searchTerm} onChange={handleSearchChange} />
                                <div className="list-group">
                                    {filteredContacts.map(contact => (
                                        <button key={contact.id} type="button" className="list-group-item list-group-item-action" onClick={() => handleContactClick(contact)}>ID:{contact.id},Country:{contact.country.name}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="onlyEven" checked={onlyEven} onChange={handleCheckboxChange} />
                                    <label className="form-check-label" htmlFor="onlyEven">Only even</label>
                                </div>
                                {showModalA && <button className="btn btn-primary" onClick={handleModalA}>All Contacts</button>}
                                {showModalB && <button className="btn btn-warning" onClick={handleModalB}>US Contacts</button>}
                                <button className="btn btn-primary" onClick={closeModal}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
                {showModalC && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Contact Details</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModalC(false)}></button>
                            </div>
                            <div className="modal-body">
                                {selectedContact && (
                                    <div>
                                        <p>ID: {selectedContact.id}</p>
                                        <p>Phone: {selectedContact.phone}</p>
                                        {selectedContact.country && <p>Country: {selectedContact.country.name}</p>}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" onClick={() => setShowModalC(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Problem2;
