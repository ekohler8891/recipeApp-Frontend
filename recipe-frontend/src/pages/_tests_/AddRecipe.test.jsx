// src/pages/__tests__/AddRecipe.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import AddRecipe from '../AddRecipe';
import { BrowserRouter } from 'react-router-dom';

test('renders AddRecipe form', () => {
    render(
        <BrowserRouter>
            <AddRecipe />
        </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/recipe title/i)).toBeInTheDocument();
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
});
