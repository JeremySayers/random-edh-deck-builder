import { InputText } from 'primereact/inputtext';
import React from 'react';

interface searchComponentProps {
    searchString: string;
    setSearchString: any;
}

const SearchComponent = (props: searchComponentProps) => {
    return (
        <div  className="searchContainer">
            <div className="p-input-icon-left search-box">
                <i className="pi pi-search"/>
                <InputText className="search-input-box" value={props.searchString} onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setSearchString(e.target.value)} placeholder="Search" />
            </div>
        </div>
    );
}

export default SearchComponent;