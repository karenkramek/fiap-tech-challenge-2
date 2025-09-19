import React from 'react';
import { Investment } from '../types';

interface InvestmentListProps {
    investments: Investment[];
}

const InvestmentList: React.FC<InvestmentListProps> = ({ investments }) => {
    return (
        <div>
            <h2>Investment List</h2>
            <ul>
                {investments.map(investment => (
                    <li key={investment.id}>
                        {investment.name}: ${investment.amount} on {investment.date}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InvestmentList;