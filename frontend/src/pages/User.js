import React, { useState } from 'react'
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../graphQL/Mutations';

const UserPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [createUser, { data, loading, error }] = useMutation(CREATE_USER);
    if (loading) return 'Submitting...';



    const handleSubmit = (e) => {
        e.preventDefault();

        if (email.trim().length === 0 || password.trim().length === 0) {
            console.log("Empty email and/or password")
            return;
        }
        createUser({ variables: { email: email, password: password } });
    }

    return (
        <form className="container" onSubmit={e => { handleSubmit(e) }}>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)} />

            </div>


            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="">
                <div>
                    <button className="btn btn-primary" type="button">Switch to Signup</button>
                </div>

                <div>
                    <button type="submit" className="btn btn-success">Submit</button>
                </div>

            </div>



        </form>
    )
}

export default UserPage;