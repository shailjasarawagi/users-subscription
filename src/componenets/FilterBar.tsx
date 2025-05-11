"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import type { UserWithSubscription, FilterOptions } from "../types";
import useDebounce from "../hooks/useDebounce";
import "../styles/FilterBar.css";

interface FilterBarProps {
  users: UserWithSubscription[];
  onFilterChange: (filters: FilterOptions) => void;
}

const STORAGE_KEY = "user_dashboard_filters";

const FilterBar = ({ users, onFilterChange }: FilterBarProps) => {
  const [status, setStatus] = useState<string>("");
  const [packageType, setPackageType] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [countrySearch, setCountrySearch] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 300);
  const debouncedCountrySearch = useDebounce(countrySearch, 300);

  useEffect(() => {
    const savedFilters = localStorage.getItem(STORAGE_KEY);
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters) as {
          status: string;
          packageType: string;
          country: string;
          search: string;
        };

        setStatus(parsedFilters.status || "");
        setPackageType(parsedFilters.packageType || "");
        setCountry(parsedFilters.country || "");
        setSearch(parsedFilters.search || "");
      } catch (error) {
        console.error("Error parsing saved filters:", error);
      }
    }
  }, []);

  const uniqueCountries = useMemo(() => {
    const countries = Array.from(new Set(users.map((user) => user.country)));
    return countries.sort();
  }, [users]);

  const filteredCountries = useMemo(() => {
    if (!debouncedCountrySearch) return uniqueCountries;
    return uniqueCountries.filter((c) =>
      c.toLowerCase().includes(debouncedCountrySearch.toLowerCase())
    );
  }, [uniqueCountries, debouncedCountrySearch]);

  const uniquePackages = useMemo(() => {
    const packages = Array.from(
      new Set(
        users
          .filter((user) => user.subscription)
          .map((user) => user.subscription!.package)
      )
    );
    return packages.sort();
  }, [users]);

  useEffect(() => {
    const newFilters: FilterOptions = {};

    if (status) newFilters.status = status;
    if (packageType) newFilters.package = packageType;
    if (country) newFilters.country = country;
    if (debouncedSearch) newFilters.search = debouncedSearch;

    setFilters(newFilters);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        status,
        packageType,
        country,
        search: debouncedSearch,
      })
    );
  }, [status, packageType, country, debouncedSearch]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleReset = () => {
    setStatus("");
    setPackageType("");
    setCountry("");
    setCountrySearch("");
    setSearch("");
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleCountrySelect = (selectedCountry: string) => {
    setCountry(selectedCountry);
    setIsCountryDropdownOpen(false);
    setCountrySearch("");
  };

  return (
    <div className="filter-bar">
      <div className="filter-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button
              className="clear-search"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="filter-section">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>

        <select
          value={packageType}
          onChange={(e) => setPackageType(e.target.value)}
          className="filter-select"
        >
          <option value="">All Plans</option>
          {uniquePackages.map((pkg) => (
            <option key={pkg} value={pkg}>
              {pkg}
            </option>
          ))}
        </select>

        <div className="country-dropdown-container" ref={countryDropdownRef}>
          <div
            className="country-dropdown-header"
            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
          >
            <span>{country || "All Countries"}</span>
            <span className="dropdown-arrow">
              {isCountryDropdownOpen ? "▲" : "▼"}
            </span>
          </div>

          {isCountryDropdownOpen && (
            <div className="country-dropdown-content">
              <input
                type="text"
                placeholder="Search countries..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="country-search-input"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="country-options">
                <div
                  className={`country-option ${
                    country === "" ? "selected" : ""
                  }`}
                  onClick={() => handleCountrySelect("")}
                >
                  All Countries
                </div>
                {filteredCountries.map((c) => (
                  <div
                    key={c}
                    className={`country-option ${
                      country === c ? "selected" : ""
                    }`}
                    onClick={() => handleCountrySelect(c)}
                  >
                    {c}
                  </div>
                ))}
                {filteredCountries.length === 0 && (
                  <div className="no-countries">No matching countries</div>
                )}
              </div>
            </div>
          )}
        </div>

        <button onClick={handleReset} className="reset-button">
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
