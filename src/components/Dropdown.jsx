import React, { useState } from 'react';
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react';
import { HiChevronUpDown } from 'react-icons/hi2';
import PropTypes from 'prop-types';

function Dropwdown({
    id,
    name,
    list,
    title,
    search,
    selected,
    setSelected,
    bottom,
}) {
    const [query, setQuery] = useState('');

    const filteredPeople = list.filter((person) =>
        person.Name.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (person) => {
        setSelected(person); // Simpan objek `person` langsung di `selected`
    };

    return (
        <div className="flex flex-col justify-start items-start w-full">
            <Listbox value={selected} onChange={handleSelect}>
                <div className="relative mt-2 w-full">
                    <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-3 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                        <span className="flex items-center">
                            <span className="ml-3 block truncate">
                                {selected?.Name ? selected.Name : title}
                            </span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                            <HiChevronUpDown />
                        </span>
                    </ListboxButton>

                    <ListboxOptions
                        transition
                        className={`absolute z-10 mt-2 max-h-72 w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${
                            bottom === true ? '-top-40' : 'top-12'
                        } `}
                    >
                        <div className="px-3 py-2">
                            <input
                                type="text"
                                id={id}
                                name={name}
                                placeholder={search}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <div className={`max-h-32 overflow-auto`}>
                            {filteredPeople.length > 0 ? (
                                filteredPeople.map((person, index) => (
                                    <ListboxOption
                                        key={index}
                                        value={person}
                                        name={name}
                                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white max-h-72 overflow-y-auto"
                                    >
                                        <div className="flex items-center">
                                            <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold text-xs">
                                                {person.Name}{' '}
                                                {person.Vehicle
                                                    ? `(${person.Vehicle})`
                                                    : ''}
                                            </span>
                                        </div>
                                    </ListboxOption>
                                ))
                            ) : (
                                <div className="py-2 px-3 text-gray-500">
                                    Tidak ada data.
                                </div>
                            )}
                        </div>
                    </ListboxOptions>
                </div>
            </Listbox>
        </div>
    );
}

Dropwdown.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    title: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    selected: PropTypes.object.isRequired,
    setSelected: PropTypes.func.isRequired,
    bottom: PropTypes.bool,
};

export default Dropwdown;
