import { Menubar } from 'primereact/menubar';
import React from 'react';
import SearchComponent from './search-component';

interface MenuComponentProps {
    currentDeckCount: number,
    handleNewClick: any,
    handleExportAsTxtClick: any,
    handleMenuExportAsJsonClick: any,
    searchString: string,
    setSearchString: any
}

const MenuComponent = (props: MenuComponentProps) => {
    const items = [
        {
           label:'File',
           icon:'pi pi-fw pi-file',
           items:[
              {
                 label:'New',
                 icon:'pi pi-fw pi-plus',
                 command: () => {
                    props.handleNewClick();
                 }
              },
              {
                 label:'Export',
                 icon:'pi pi-fw pi-external-link',
                 items:[
                    {
                        label:'json',
                        icon:'pi pi-cloud-download',
                        command: () => {
                            props.handleMenuExportAsJsonClick();
                        }
                     },
                     {
                        label:'txt',
                        icon:'pi pi-cloud-download',
                        command: () => {
                            props.handleExportAsTxtClick();
                        }
                     }
                 ]
              }
           ]
        },
        {
           label:'Edit',
           icon:'pi pi-fw pi-pencil',
           items:[
              {
                 label:'Undo',
                 icon:'pi pi-undo'
              },
              {
                 label:'Redo',
                 icon:'pi pi-redo'
              }
           ]
        },
        {
           label:'View',
           icon:'pi pi-list'           
        }        
     ];

     const end =
        <div className="menu-end-components">
            <SearchComponent 
                searchString={props.searchString}
                setSearchString={props.setSearchString}
            />
            <div className="menu-end-deck-text">Current Deck Size ({props.currentDeckCount}/100)</div>
        </div>;

     return (<Menubar className="menu-component-container" model={items} end={()=>end}/>);
}

export default MenuComponent;