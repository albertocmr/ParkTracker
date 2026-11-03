import React from 'react';

function Search({ onSearch }) {

    const handleSearch = (event) => {
        onSearch(event.target.value);
    };

    return (
        <div className="relative w-full sm:w-72">
            <svg xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-pine-900/35" width="15" height="15" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85a1.007 1.007 0 0 0-.115-.098zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
            <input
                type="search"
                className="input pl-10"
                placeholder="Buscar por nombre…"
                aria-label="Buscar por nombre"
                onChange={handleSearch}
            />
        </div>
    );
}

export default Search;
