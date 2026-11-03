import React from 'react';


const NaturalParkComponent = (props) => {

    return (
        <a
            href={"/parques-naturales/" + props.perimeterfile}
            className="card group flex flex-col justify-between p-6 transition duration-300 hover:-translate-y-1 hover:border-pine-500/20 hover:shadow-lift"
        >
            <div>
                <p className="eyebrow">{props.province}</p>
                <h2 className="mt-3 text-2xl font-medium leading-snug">{props.name}</h2>
            </div>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-pine-700">
                Ver normativa
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
        </a>
    )
}


export default NaturalParkComponent;
