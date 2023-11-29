export function CollectionFilter(){
    const onSortParam = event => {

    }
    return (
        <div className="collection-filter-section">
            <p className="sort-title"> Sort By </p>
            <ul>
                <li data-sort-key="MANUAL" data-sort-reverse="false" onClick={onSortParam}>Featured</li>
                <li data-sort-key="TITLE" data-sort-reverse="false" onClick={onSortParam}>A to Z</li>
                <li data-sort-key="PRICE" data-sort-reverse="false" onClick={onSortParam}>Price Low to High</li>
            </ul>
        </div>
        
    );
}