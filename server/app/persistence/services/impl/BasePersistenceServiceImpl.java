package persistence.services.impl;

import java.util.List;

import persistence.dao.BaseDao;
import persistence.filters.Filter;
import persistence.model.AbstractEntity;
import persistence.services.BasePersistenceService;

import com.avaje.ebean.annotation.Transactional;

@Transactional
public abstract class BasePersistenceServiceImpl<T extends AbstractEntity> implements BasePersistenceService<T> {
	protected abstract BaseDao<T> getBaseDao();

	@Override
	public void save(T entity) {
		getBaseDao().save(entity);
	}

	@Override
	public List<T> getAll() {
		return getBaseDao().getBy(null);
	}

	@Override
	public void delete(T entity) {
		getBaseDao().delete(entity);
	}

	@Override
	@Transactional(readOnly = true)
	public List<T> getBy(Filter filter) {
		return getBaseDao().getBy(filter);
	}

	@Override
	@Transactional(readOnly = true)
	public T getSingleBy(Filter filter) {
		return getBaseDao().getSingleBy(filter);
	}
}
